import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthForm } from '@/components/auth/auth-form'
import { BackgroundTexture } from '@/components/ui/background-texture'
import sitetrackerLogo from '../../assets/images/sitetracker-Logo.png'
import sitetrackerLogoIcon from '../../assets/images/sitetracker_logo_icon.png'
import { useAuth } from '@/lib/contexts/auth-context'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [navigate, user, loading])

  if (loading) {
    return null
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <BackgroundTexture />

      <div className="relative z-10 w-full max-w-[980px] p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="relative inline-flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={sitetrackerLogo}
                alt="SiteTracker"
                width={280}
                height={60}
                className="drop-shadow-lg"
              />
            </motion.div>
            <div className="relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-white/80 via-white to-white/80"
              />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent pb-1 drop-shadow-sm">
                Sitetracker Spark
              </h1>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-4 text-xl text-white/80 font-light tracking-wide"
          >
            Streamline your Salesforce and supercharge it
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8"
        >
          <AuthForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <div className="flex justify-center items-center">
            <p>Powered by Sitetracker</p>
            <img
              src={sitetrackerLogoIcon}
              alt="sitetracker"
              width={30}
              height={30}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </motion.div>
      </div>
    </main>
  )
}
