function ActionIconButton({ title, onClick, iconSrc, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black-40 text-black-100 hover:bg-black-20"
    >
      {iconSrc ? (
        <img src={iconSrc} alt="" className="h-5 w-5" />
      ) : (
        children
      )}
    </button>
  );
}

export default ActionIconButton;