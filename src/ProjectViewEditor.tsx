import Modal from 'react-modal';
import { Link, useParams, useNavigate } from 'react-router-dom';

export const ProjectViewEditor = () => {
    const { projectId } = useParams();
    let navigate = useNavigate();

    return <div>
        <Modal isOpen={true}>
            <h3>TESTING {projectId}</h3>
            <button onClick={e => { e.preventDefault(); navigate(-1); }}>Close</button>
        </Modal>
    </div>
}