'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // Hardcoded credentials
    if (username === 'pravega' && password === '20001019@Up') {
        cookies().set('auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        redirect('/')
        'use server'

        import { cookies } from 'next/headers'
        import { redirect } from 'next/navigation'

        export async function login(formData: FormData) {
            const username = formData.get('username') as string
            const password = formData.get('password') as string

            // Hardcoded credentials
            if (username === 'pravega' && password === '20001019@Up') {
                cookies().set('auth', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                })
                redirect('/')
            } else {
                return { error: 'Invalid credentials' }
            }
        }

        export async function logout() {
            (await cookies()).delete('auth')
            redirect('/login')
        }
