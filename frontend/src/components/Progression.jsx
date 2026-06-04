export default function Progression({ data }) {
  return (
    <>
      <h2 className="section-title">
        <span className="icon">📈</span> PROGRESSION DE L'ENTRAÎNEMENT
      </h2>
      <div className="card">
        <div className="timeline">
          {data.map((item, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-week">Semaine {item.week}</div>
              <div className="timeline-action">{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
