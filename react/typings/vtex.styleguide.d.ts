declare module 'vtex.styleguide' {
  export const Dropdown
  export const EmptyState
  export const IconCaretLeft
  export const IconCaretRight
  export const IconDelete
  export const Button
  export const Tag
  export const ModalDialog
  export const IconEdit
  export const Input
  export const Spinner
  export const withToast
  export const Alert
  export const Radio
  export const ActionMenu
  export const NumericStepper
  export const CheckboxGroup
  export const ButtonWithIcon
  export const IconPlus
  export const Modal
  export const InputSearch
  export const ButtonPlain
  export const PageHeader
  export interface ShowToastArgs {
    message: string
    action?: {
      label: string
      onClick: () => void
    }
  }
}
