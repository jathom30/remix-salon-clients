type InputProps = {
  name: string
  placeholder?: string
  defaultValue?: React.HTMLAttributes<HTMLInputElement>['defaultValue']
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange']
}

const classNames = "w-full p-2 text-base rounded border-1 border-text-subdued relative bg-component-background text-text"

export const Input = ({ name, placeholder, defaultValue, onChange }: InputProps) => {
  return (
    <input
      type="text"
      className={classNames}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}