"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

interface OverviewChartProps {
    data: any[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">No data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `LKR ${value}`}
                />
                <Tooltip
                    formatter={(value: any) => (value || 0).toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                    labelStyle={{ color: 'black' }}
                />
                <Legend />
                <Bar dataKey="invoiceAmount" name="Invoices" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quotationAmount" name="Quotations" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
