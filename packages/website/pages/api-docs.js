// @ts-ignore
import dynamic from 'next/dynamic'

const DynamicSwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false })

export function getStaticProps() {
  return {
    props: {
      title: 'HTTP API Docs - nftstorage.link',
      description: 'nftstorage.link API docs',
    },
  }
}

export default function docs() {
  return <DynamicSwaggerUI url="/schema.yml" />
}
