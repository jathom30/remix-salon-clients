import { createPortal } from "react-dom"

export const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  if (typeof document === 'undefined') {
    return (
      <div className="fixed inset-0">
        <div role="presentation" className="bg-black opacity-50 fixed inset-0" onClick={onClose} />
        <div className="relative z-10 max-w-2xl flex m-4 bg-white p-4 rounded shadow-lg sm:m-auto sm:mt-4">
          {children}
        </div>
      </div>
    )
  }

  return createPortal(
    <div className="fixed inset-0">
      <div role="presentation" className="bg-black opacity-50 fixed inset-0" onClick={onClose} />
      <div className="relative z-10 max-w-2xl flex m-4 bg-white p-4 rounded shadow-lg sm:m-auto sm:mt-4">
        {children}
      </div>
    </div>, document.body
  )
}