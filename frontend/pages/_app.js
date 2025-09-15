import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="dark min-h-screen text-white bg-[rgb(17,17,17)]">
      <Component {...pageProps} />
    </div>
  );
}
