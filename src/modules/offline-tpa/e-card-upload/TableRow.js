import React from 'react';

const ExtractStatus = {
  true: {
    label: 'Uploaded ',
    color: 'success'
  },
  false: {
    label: 'Failed ',
    color: 'danger'
  }
}

export function TableRow({ fileName, fileIndex, removeFile, response, loadingUpload, retryUpload }) {
  return (
    <tr>
      <td>
        {fileIndex + 1}
      </td>
      <td>
        {fileName}
      </td>
      {(!loadingUpload && (!response.length || response.every((elem) => elem?.status === 'false'))) && <td>
        <i className="ti ti-close" role='button' onClick={() => removeFile(fileIndex)}></i>
      </td>}
      {(loadingUpload || !!response.length) && <td className={`text-${ExtractStatus[response[fileIndex]?.status]?.color || 'primary'}`}>
        {response[fileIndex]?.message || 'Processing '}
        {!response[fileIndex]?.status && <img src={'/assets/images/loading-buffering.gif'} width='15px' alt='...' />}
        {response[fileIndex]?.status === 'false' && <i className="ti ti-reload " role='button' onClick={() => retryUpload(fileIndex)}></i>}
      </td>}
    </tr>
  )
}
