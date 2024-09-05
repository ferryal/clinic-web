import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import Loader from '@/components/loader'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import useAnamnesis from '@/apis/queries/useAnamnesis'

export default function Tasks() {
  const { data, isLoading } = useAnamnesis()

  if (isLoading) {
    return <Loader />
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Anamnesis</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your Anamnesis!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={data} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
