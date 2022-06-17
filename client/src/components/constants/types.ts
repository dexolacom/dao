export interface ProposalProps {
  title: string
  address: string
  methodName: string
}

export interface BackdropProps {
  children: JSX.Element[] | JSX.Element
  setIsProposalEditorOpen: (b:boolean) => void
}