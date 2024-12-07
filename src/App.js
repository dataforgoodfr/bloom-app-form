import Navbar from './components/Navbar';
import './i18n';

function App({ Component, pageProps }) {
  return (
    <div className="App">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default App; 