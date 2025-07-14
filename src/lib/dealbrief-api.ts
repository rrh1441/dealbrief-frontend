// Backend compatibility layer for dealbrief-scanner
// This will be configured to run separately on Fly.io

interface ScanOptions {
  priority?: 'high' | 'normal' | 'low'
  modules?: string[]
  depth?: number
}

interface ScanResponse {
  scanId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  message?: string
}

interface ScanStatus {
  scanId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  currentModule?: string
  startedAt: string
  completedAt?: string
  error?: string
}

interface Finding {
  id: string
  scanId: string
  type: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  description: string
  asset: string
  evidence?: any
  remediation?: any
  cveId?: string
  cvssScore?: number
  ealMl?: number
}

class DealBriefAPI {
  private baseUrl: string

  constructor() {
    // This will point to your dealbrief-scanner backend
    // When deployed separately, this will be your Fly.io URL
    this.baseUrl = process.env.DEALBRIEF_BACKEND_URL || 'http://localhost:8080'
  }

  async triggerScan(domain: string, options: ScanOptions = {}): Promise<ScanResponse> {
    try {
      // For now, use the direct Fly.io URL. In production, this would be configurable
      const response = await fetch(`${this.baseUrl}/scans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
          ...(process.env.DEALBRIEF_API_KEY && {
            'Authorization': `Bearer ${process.env.DEALBRIEF_API_KEY}`
          })
        },
        body: JSON.stringify({
          domain,
          companyName: domain, // Use domain as company name for simplicity
          tags: [],
          ...options
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return {
        scanId: result.scanId || result.id || '',
        status: 'queued',
        message: result.message
      }
    } catch (error) {
      console.error('Failed to trigger scan:', error)
      throw new Error('Failed to trigger scan')
    }
  }

  async triggerBulkScan(domains: string[], options: ScanOptions = {}): Promise<{scans: ScanResponse[]}> {
    try {
      // For bulk scans, we'll trigger individual scans
      // You might want to implement a bulk endpoint in your backend later
      const scanPromises = domains.map(domain => this.triggerScan(domain, options))
      const scans = await Promise.allSettled(scanPromises)
      
      return {
        scans: scans.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value
          } else {
            return {
              scanId: '',
              status: 'failed' as const,
              message: `Failed to scan ${domains[index]}: ${result.reason}`
            }
          }
        })
      }
    } catch (error) {
      console.error('Failed to trigger bulk scan:', error)
      throw new Error('Failed to trigger bulk scan')
    }
  }

  async getScanStatus(scanId: string): Promise<ScanStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/scan/${scanId}/status`, {
        headers: {
          ...(process.env.DEALBRIEF_API_KEY && {
            'Authorization': `Bearer ${process.env.DEALBRIEF_API_KEY}`
          })
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get scan status:', error)
      throw new Error('Failed to get scan status')
    }
  }

  async getFindings(scanId: string): Promise<Finding[]> {
    try {
      // This will query your Supabase database directly
      // since findings are stored there, not in the backend API
      const response = await fetch(`/api/findings?scanId=${scanId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.findings || []
    } catch (error) {
      console.error('Failed to get findings:', error)
      throw new Error('Failed to get findings')
    }
  }

  async getAllScans(): Promise<any[]> {
    try {
      const response = await fetch('/api/scans')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get all scans:', error)
      throw new Error('Failed to get all scans')
    }
  }

  async generateReport(scanId: string, reportType: 'threat_snapshot' | 'executive_summary' | 'technical_remediation'): Promise<{reportId: string, status: string}> {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, reportType })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to generate report:', error)
      throw new Error('Failed to generate report')
    }
  }

  async triggerSingleScan(domain: string): Promise<ScanResponse> {
    try {
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          domain,
          companyName: domain // Use domain as company name for simplicity
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return {
        scanId: result.scanId || result.id || '',
        status: 'queued',
        message: result.message
      }
    } catch (error) {
      console.error('Failed to trigger single scan:', error)
      throw new Error('Failed to trigger single scan')
    }
  }
}

// Export singleton instance
export const dealBriefAPI = new DealBriefAPI()

// Export types for use in components
export type { ScanOptions, ScanResponse, ScanStatus, Finding }