import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/api/auth/login')
  }, [router])

  return null
}

export const getServerSideProps = async (context) => {
  try {
    const result = withPageAuthRequired()
    const data = await result(context)

    if (data.props.user) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: true,
        },
      }
    }

    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: true,
      },
    }
  } catch {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: true,
      },
    }
  }
}
