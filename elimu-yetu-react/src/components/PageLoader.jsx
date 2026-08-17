import logo from "../assets/images/elimu (3).png";

function PageLoader({ show }) {
  return (
    <div className={`page-loader ${!show ? "page-loader-hidden" : ""}`} aria-hidden={!show}>
      <div className="page-loader-logo-wrap">
        <div className="page-loader-ring"></div>
        <img src={logo} alt="Elimu Yetu" className="page-loader-logo" />
      </div>
    </div>
  );
}

export default PageLoader;