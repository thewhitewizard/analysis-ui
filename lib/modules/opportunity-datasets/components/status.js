import distanceInWords from 'date-fns/distance_in_words_to_now'
import React from 'react'

import message from 'lib/message'

const isErrorOrDone = status => status === 'ERROR' || status === 'DONE'

function statusToStyle(status) {
  switch (status) {
    case 'ERROR':
      return 'danger'
    case 'UPLOADING':
    case 'PROCESSING':
      return 'info'
    case 'DONE':
      return 'success'
    default:
      return 'warning'
  }
}

export default function Status(p) {
  return (
    <div className={`alert alert-${statusToStyle(p.status)}`}>
      {isErrorOrDone(p.status) && (
        <button className='close' onClick={p.clear} type='button'>
          &times;
        </button>
      )}
      <p>
        <strong>
          {p.name} ({p.status})
        </strong>
      </p>
      {p.status === 'DONE' && (
        <p>
          {message('opportunityDatasets.finishedUploading', {
            total: `${p.totalGrids}`,
            completedAt: distanceInWords(p.completedAt)
          })}
          <a
            onClick={() => {
              p.clear()
              window.location.reload(true)
            }}
            tabIndex={0}
          >
            {' '}
            {message('opportunityDatasets.reloadPage')}
          </a>
        </p>
      )}
      {p.status === 'UPLOADING' && (
        <p>
          {message('opportunityDatasets.uploadProgress', {
            createdAt: distanceInWords(p.createdAt),
            completed: `${p.uploadedGrids}`,
            total: `${p.totalGrids}`
          })}
        </p>
      )}
      {p.message && p.message.length > 0 && <p>{p.message}</p>}
    </div>
  )
}