import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="section text-center">
      <h1 className="text-5xl font-bold text-terracotta">404</h1>
      <p className="mt-3 text-stone">{t('common.notFound')}</p>
      <Link to="/" className="btn btn-primary mt-6">{t('common.backHome')}</Link>
    </div>
  )
}
