import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Placar from './components/Placar'
import Resultado from './components/Resultado'
import { connectMQTT } from './services/mqttService'

function App() {

  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [media, setMedia] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    connectMQTT((topic, payload) => {
      if (topic === 'luizG/resp_enviada') {
        if (payload === 'Correta') setAcertos(prev => prev + 1);
        else setErros(prev => prev + 1);
      }
      if (topic === 'luizG/resultado') {
        const match = payload.match(/Media:(\d+\.?\d*)%/);
        if (match) setMedia(parseFloat(match[1]));
      }
      if (topic === 'luizG/statusAluno') {
        setStatus(payload);
      }
    });
  }, []);

  return (
    <>
    <h2 className='mb-2'>Quiz IoT - Resultado em Tempo Real</h2>
    <p className='small mb-5 text-body text-opacity-75'>v1.0</p>
      <Placar acertos={acertos} erros={erros} />
      {media > 0 && <Resultado media={media} status={status}/>}
    </>
  )
}

export default App
