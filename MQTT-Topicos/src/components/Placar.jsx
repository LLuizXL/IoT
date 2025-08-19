import React from 'react'

const Placar = ({acertos, erros}) => {
  return (
    <div className='card text-center shadow p-3 mb-3 bg-body rounded'>
        <div className="card-header">
            <h3>Placar Total: </h3>
        </div>
        <div className='card-body'>
            <p className='text-success'>Questões corretas: {acertos} </p>
            <p className='text-danger'>Questões incorretas: {erros}</p>
        </div>

    </div>
  )
}

export default Placar