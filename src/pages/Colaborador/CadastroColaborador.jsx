import React, { useState, useEffect} from 'react';
import Header from '../../components/Header/Header';
import { IMaskInput } from "react-imask";
import { ValidarCPF } from '../../utils/CPF';
import axios from "axios";
import FlashMessage from '../../components/FlashMessage/FlashMessage';

export default function CadastroColaborador() {

  const [msg, setMsg] = useState('');
  const [tipo, setTipo] = useState('');
  const [alert, setAlert] = useState(false);

  const [cpf, setCpf] = useState('');
  const [formVal, setFormVal] = useState([{nome:'', cpf:''}]);

  const onHandle = (e, i) => {
    let newForm = [...formVal]
    newForm[i][e.target.name] = e.target.value
    setFormVal(newForm)
  }


  const formValidacao=(formVal)=>{
    const data = [...formVal]
    let valido = true
    data[0]['cpf'] = cpf;

    for (let index = 0; index < data.length; index++) {
              
      if(data[index].nome === "") {
        data[index].checarNome = "É necessário inserir um nome"
        data[index].checarTamanhoNome = ""
        valido = false

      } else if(data[index].nome.length < 5) {
        data[index].checarTamanhoNome = "O nome deve ter mais de 5 caracteres"
        data[index].checarNome = ""
        valido = false
      }
      else{
        data[index].checarNome = ""
        data[index].checarTamanhoNome = ""
        valido = true
      }

      if(data[index].cpf === "" ) {
        data[index].checarCpf = "É necessário inserir um CPF"
        data[index].checarTamanhoCpf = ""
        valido = false

      }else if( data[index].cpf.length !== 11 || !ValidarCPF(data[index].cpf) ) {
        data[index].checarCpf = "CPF inválido"
        data[index].checarTamanhoCpf = ""
        valido = false

      } else {
        data[index].checarCpf = ""
        data[index].checarTamanhoCpf = ""
        valido = true
      }
      
    }
    setFormVal(data)
    return valido
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    const validado = formValidacao(formVal)
    if(validado) {
      delete formVal[0].checarNome;
      delete formVal[0].checarCpf;
      delete formVal[0].checarTamanhoCpf;
      delete formVal[0].checarTamanhoNome;

    // axios
    const options = {
      url: `${process.env.REACT_APP_BASE_URL}/colaborador/cadastrar`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: formVal[0]
    };
    await axios(options)
      .then(async(res) => {
        setTipo("sucess");
        setMsg(await res.data);
        setAlert(true);
    }).catch(async(err) => {
      setTipo("danger");
      setAlert(true);
      setMsg(await err.response?.data ?? "Serviço indisponível");
      });
   }
  }

  useEffect(()=>{
    const time = setTimeout(()=>(setAlert(false)),4000);
    return () => clearTimeout(time);
  }, [alert])

  return (
    <div>
      <Header/>
     { alert && <FlashMessage type={`${tipo}`} msg={`${msg}`}/>}
      <main className="main container">
        <section>
          <h3>Criar Colaborador</h3>

          {formVal.map((item, i) => (
            <div>            
            <form className="main__formulario" onSubmit={onSubmit} method="post">
                <label htmlFor="nome">Nome:</label>
                <input type="text" name="nome" id="nome" value={item.nome || ""} onChange={(e)=> onHandle(e, i)} placeholder="Digite o nome do colaborador"/>
                <label htmlFor="cpf">CPF:</label>
                <IMaskInput              
                mask="000.000.000-00"
                unmask={true}
                placeholder="Digite o CPF do colaborador"
                onAccept={ (value, mask) => {
                  setCpf(value)
                }}
                />            
                  <div style={{color:'red'}}>{item.checarNome}<br/>{item.checarTamanhoNome}</div>
                  <div style={{color:'red'}}>{item.checarCpf}<br/>{item.checarTamanhoCpf}</div>
                <button type='submit' >Cadastrar colaborador</button>
            </form>
            </div>
          ))}
        </section>

    </main>
    </div>  
  );
};
