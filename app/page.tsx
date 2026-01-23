"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, File, ArrowRight, Plus } from "lucide-react"
import { db, SavedDocument } from "@/lib/db"
import { OverviewChart } from "@/components/overview-chart"
import { TopClientsChart } from "@/components/top-clients-chart"

interface DashboardStats {
  totalInvoices: number
  totalQuotations: number
  totalRevenue: number
  totalQuotedValue: number
  monthlyRevenue: number
  monthlyQuotedValue: number
  recentDocuments: SavedDocument[]
  chartData: any[]
  forecastNextMonth: number
  topClients: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalQuotations: 0,
    totalRevenue: 0,
    totalQuotedValue: 0,
    monthlyRevenue: 0,
    monthlyQuotedValue: 0,
    recentDocuments: [],
    chartData: [],
    forecastNextMonth: 0,
    topClients: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const basicStats = await db.getDashboardStats()
      const analyticsStats = await db.getAnalyticsData()

      setStats({
        ...basicStats,
        ...analyticsStats
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your business activity.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/editor">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
            </div>
            <p className="text-xs text-muted-foreground">{stats.totalInvoices} Invoices Issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quoted</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalQuotedValue.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
            </div>
            <p className="text-xs text-muted-foreground">{stats.totalQuotations} Quotations Pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyRevenue.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Quoted</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyQuotedValue.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>
              Comparing Invoices vs Quotations (Monthly)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={stats.chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>
              Projection for next month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="text-4xl font-bold text-green-600">
                {stats.forecastNextMonth?.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
              </div>
              <p className="text-center text-sm text-muted-foreground px-4">
                Based on the last 3 months average, we forecast this invoice revenue for next month.
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-4 max-w-[200px]">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground pt-2">Confidence: Moderate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
            <CardDescription>
              Highest contributors to revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopClientsChart data={stats.topClients} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              You made {stats.totalInvoices + stats.totalQuotations} documents total.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                stats.recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${doc.type === 'invoice' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'}`}>
                      {doc.type === 'invoice' ? <FileText className="h-4 w-4" /> : <File className="h-4 w-4" />}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{doc.documentNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.clientName}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {doc.grandTotal.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Fast access to common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/editor?type=invoice">
              <Button variant="outline" className="w-full justify-start h-14">
                <div className="bg-primary/10 p-2 rounded-md mr-4">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">New Invoice</div>
                  <div className="text-xs text-muted-foreground">Create a bill for a client</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/editor?type=quotation">
              <Button variant="outline" className="w-full justify-start h-14">
                <div className="bg-orange-100 p-2 rounded-md mr-4">
                  <File className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">New Quotation</div>
                  <div className="text-xs text-muted-foreground">Estimate for a project</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
