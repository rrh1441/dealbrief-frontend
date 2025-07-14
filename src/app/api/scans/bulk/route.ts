import { NextRequest, NextResponse } from 'next/server'
import { dealBriefAPI } from '@/lib/dealbrief-api'

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json() as { domains: string[] }

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: 'Domains array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Filter out empty domains
    const validDomains = domains.filter(domain => domain && domain.trim())

    if (validDomains.length === 0) {
      return NextResponse.json(
        { error: 'No valid domains found' },
        { status: 400 }
      )
    }

    // Use the dealBriefAPI to trigger bulk scans
    const result = await dealBriefAPI.triggerBulkScan(validDomains)

    // Transform the response to match frontend expectations
    const scans = result.scans.map(scan => ({
      domain: validDomains[result.scans.indexOf(scan)] || 'unknown',
      scanId: scan.scanId,
      status: scan.status === 'queued' ? 'started' : scan.status
    }))

    return NextResponse.json({ scans })

  } catch (error) {
    console.error('Failed to process bulk scans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}