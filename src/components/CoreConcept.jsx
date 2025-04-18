export default function CoreConcept(props) {
    return (
      <li>
        <img src={props.image} alt='#' />
        <h3 style={{ whiteSpace: 'nowrap' }}>{props.title}</h3>
        <p>{props.description}</p>
      </li>
    );
  }