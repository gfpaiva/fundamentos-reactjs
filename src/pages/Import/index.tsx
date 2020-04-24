import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [error, setError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    setError('');

    if (!uploadedFiles.length) {
      setError('Arquivo obrigatório');
      return;
    }

    const data = new FormData();

    uploadedFiles.forEach(({ file }) => {
      data.append('file', file);
    });

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente mais tarde');
    }
  }

  function submitFile(files: File[]): void {
    const formattedFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(formattedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>

          {error && <Error>{error}</Error>}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
