export default function InputError({ message, className = '' }) {
    return message ? (
        <p className={`text-xs text-danger ${className}`}>{message}</p>
    ) : null;
}
