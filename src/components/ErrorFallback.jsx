export function ErrorFallback({ error }) {
    return (
        <div role="alert" style={{ padding: '20px', color: 'red' }}>
            <p>Something went wrong:</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <pre>{error.stack}</pre>
        </div>
    )
}
