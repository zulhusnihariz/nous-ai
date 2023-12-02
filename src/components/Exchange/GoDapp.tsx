import GenericButton from 'components/Button/GenericButton'

interface Prop {
  dataKey: string
  disabled: boolean
}

const GoToDappButton = (prop: Prop) => {
  const onOpenDapp = () => {
    window.open(`/room/${prop.dataKey}`, '_blank')
  }

  return <GenericButton name="Access Dapp" onClick={onOpenDapp} disabled={prop.disabled} />
}

export default GoToDappButton
