interface Prop {
  classNames?: string
  children: React.ReactNode
}
const TypographyNormal = ({ children, classNames }: Prop) => {
  return (
    <span className={`tracking-wide [text-shadow:1px_1px_1px_var(--tw-shadow-color)] shadow-black ${classNames}`}>
      {children}
    </span>
  )
}

export default TypographyNormal
