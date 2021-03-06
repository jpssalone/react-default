import React , {Component, Fragment} from 'react' 
import { ThemeReport } from './style'
import { Alert, Table, ButtonGroup, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import swal from 'sweetalert' 


import API from '../../services/Api'
import Preload from '../Preload';
import PDF from '../PDF/';
import ParticipantController from '../../services/controller/ParticipantController';

const LINK = 'http://localhost/Crud-com-PHP-MYSQLI/'

export default class Report extends Component {
    state = {
        loaded: true,
        participant: [],
        estados: [],
        sigla: 'CE',
        limit: 30,
        clickPDF: false
    }
    async componentDidMount() { 
        const participant = await ParticipantController.getAll(this.state.limit,this.state.sigla)
        const state = await API.get('State/')
        console.table(participant.data)
        this.setState({  
            loaded: false, 
            participant: participant.data,
            estados: state.data
        });
    }
    handleSelectLimit = async (event) => { 
        this.setState({ loaded: true })
        const limit = event.target.value
        const { data } = await ParticipantController.getAll(event.target.value,this.state.sigla) 
        this.setState({ limit: limit, loaded: false,  participant: data });
    }
    handleDataListState = async (event) => {  
        this.setState({ loaded: true })
        const sigla = event.target.value
        const { data } = await ParticipantController.getAll(this.state.limit,event.target.value)
        this.setState({ sigla: sigla, loaded: false, participant: data });
    }
    showItemParticipant = (participant) => { 
        return(
            <tr key={participant.idParticipant}> 
                <td>{participant.name}</td>
                <td>{participant.adress}</td> 
                <td>{participant.city}</td> 
                <td>{participant.state}</td> 
                <td>{participant.phone}</td> 
            </tr>
        )
    }
    
    sendTXT = () => {
        window.location.href = `${LINK}Participant/generationTxt?limit=${this.state.limit}&state=${this.state.sigla}`
        swal("Seu arquivo foi salvo", "", "success")
    }
    sendCSV = () => {
        window.location.href = `${LINK}Participant/generationCsv?limit=${this.state.limit}&state=${this.state.sigla}`
        swal("Seu arquivo foi salvo", "", "success")
    }
    sendPrint = () => {
        this.setState({ clickPDF: true })
        window.location.reload()
    }
    sendPdf = () => {
        window.location.href = `${LINK}Participant/generationPdf?limit=${this.state.limit}&state=${this.state.sigla}`
        swal("Seu arquivo foi salvo", "", "success")
    }
    render() {
      return <Fragment>
{/*         
        <Breadcrumb> 
            <BreadcrumbItem active>Relatório</BreadcrumbItem>
            <BreadcrumbItem active>Participante </BreadcrumbItem>
        </Breadcrumb> */}
        <ThemeReport> 
            <div className='limit'>
                <div>
                    Mostrar 
                    <select onChange={this.handleSelectLimit}>
                        <option value="30">30</option>
                        <option value="70">70</option>
                        <option value="150">150</option>
                        <option value="300">300</option>
                    </select>
                    Primeiros do Estado
                    {/* <input list="state"  /> */}
                    <select onChange={this.handleDataListState}> 
                        {this.state.estados.map(state => <option value={state.sigla}>{state.sigla}</option> )}
                    </select> 
                </div>
                <div>
                <ButtonGroup>
                    <Button outline size="sm" onClick={this.sendTXT} color="primary">TXT</Button>
                    <Button outline size="sm" onClick={this.sendPrint}  color="primary">IMPRIMIR</Button>
                    <Button outline size="sm" onClick={this.sendCSV} color="primary">CSV</Button>
                    <Button outline size="sm" onClick={this.sendPdf} color="primary">PDF</Button>
                </ButtonGroup>
                </div>
            </div>
            <Table striped>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>Telefone</th> 
                    </tr>
                </thead>
                <tbody> 
                    {!this.state.loaded && this.state.participant.map(this.showItemParticipant)}
                </tbody> 
            </Table> 
            {this.state.participant.length < 1 && <div className='notData'> <Alert color="danger">Sem dados no estado <strong>{this.state.sigla}</strong></Alert> </div>}
            {this.state.loaded && <Preload/>}
      </ThemeReport>
        {this.state.clickPDF && <PDF content={this.state.participant} />}

      </Fragment>
    }
}