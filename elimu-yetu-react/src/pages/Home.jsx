import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MaterialCard from "../components/MaterialCard";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import kidsBg from "../assets/images/kids.jpg";
import {fetchNewMaterials,fetchMostDownloaded} from "../services/materialsService";
import PageLoader from "../components/PageLoader";

// ── Arrow state hook ──────────────────────────────────────────
function useScrollState(ref, isLoading) {
  const [atStart, setAtStart] = useState(true);
  const [atEnd,   setAtEnd]   = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, [ref]);

  useEffect(() => {
  if (isLoading) return; // wait until loading is done

  // small timeout lets the DOM finish rendering the cards
  // before we measure scrollWidth
  const timer = setTimeout(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
  }, 100);

  return () => {
    clearTimeout(timer);
    const el = ref.current;
    if (!el) return;
    el.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
 }, [ref, update, isLoading]);

  return { atStart, atEnd };
}

// ── Empty state ───────────────────────────────────────────────
function EmptySection({ message }) {
  return (
    <div className="section-empty-state">
      <i className="bi bi-folder2-open"></i>
      <p>{message}</p>
      <Link to="/materials" className="btn btn-sm section-empty-btn">
        Browse all materials
      </Link>
    </div>
  );
}

// ── Reusable scroll section ───────────────────────────────────
function MaterialsSection({ title, items, sectionRef, isLoading, emptyMessage }) {
  const { atStart, atEnd } = useScrollState(sectionRef, isLoading);

  const scrollLeft  = () => sectionRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => sectionRef.current?.scrollBy({ left:  300, behavior: "smooth" });

  return (
    <div className="container py-4">

      <div className="section-header">
        <h2 className="section-heading">{title}</h2>
        <div className="arrows">
          <Link to="/materials" className="view-all-link">View All</Link>  
          <button className="prev-arrow" onClick={scrollLeft}  disabled={atStart || isLoading} aria-label="Scroll left">{"<"}</button>
          <button className="next-arrow" onClick={scrollRight} disabled={atEnd   || isLoading} aria-label="Scroll right">{">"}</button>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="d-flex gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              flex: "0 0 180px", height: "200px", borderRadius: "10px",
              background: "#222339", opacity: 0.5, animation: "pulse 1.5s infinite"
            }} />
          ))}
        </div>
      )}

      {/* Cards or empty state */}
      {!isLoading && (
        items.length === 0
          ? <EmptySection message={emptyMessage} />
          : (
            <div className="materials-wrapper" ref={sectionRef}>
              {items.map((material) => (
                <MaterialCard
                  key={material._id}
                  _id={material._id}
                  title={material.title}
                  grade={material.grade}
                  term={material.term}
                  coverImage={material.coverImage}
                  isFree={material.isFree}
                  price={material.price}
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}

// ── Main Home component ───────────────────────────────────────
function Home() {
  const { user } = useAuth();

  const newMaterialsRef   = useRef(null);
  const mostDownloadedRef = useRef(null);

  const [newMaterials,   setNewMaterials]   = useState([]);
  const [mostDownloaded, setMostDownloaded] = useState([]);
  const [loadingNew,     setLoadingNew]     = useState(true);
  const [loadingTop,     setLoadingTop]     = useState(true);
  const [showLoader,     setShowLoader]     = useState(true);
  const [fadeLoader,     setFadeLoader]     = useState(false);

  // fetch newest materials
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNewMaterials(10);
        setNewMaterials(data.materials);
      } catch (err) {
        console.error("Failed to load new materials:", err.message);
      } finally {
        setLoadingNew(false);
      }
    };
    load();
  }, []);

  // fetch most downloaded — sorted server-side by downloadCount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMostDownloaded(10);
        setMostDownloaded(data.materials);
      } catch (err) {
        console.error("Failed to load most downloaded:", err.message);
      } finally {
        setLoadingTop(false);
      }
    };
    load();
  }, []);

  // Hide the full-page loader once both sections have finished loading
  useEffect(() => {
    if (!loadingNew && !loadingTop) {
      setFadeLoader(true);
      const timer = setTimeout(() => setShowLoader(false), 400); // matches the CSS fade duration
      return () => clearTimeout(timer);
    }
  }, [loadingNew, loadingTop]);

  return (
    <>
      {showLoader && <PageLoader show={!fadeLoader} />}
      <Navbar />

      {/* Hero */}
      <div
        className="container-fluid bg-light text-center py-5 my-2"
        style={{
          backgroundImage: `url(${kidsBg})`,
          backgroundSize: "cover",
          minHeight: "400px",
        }}
      >
        <div className="container">
          <h1 className="display-5 my-4">ELIMU YETU KIDS CENTER</h1>
          <h6 className="lead">New Approach to Kids Learning</h6>
          <p>"Making Learning Simple, Fun, and Effective for Everyone!"</p>
          <p className="mb-4">
            Get Revision materials and exam papers of all Primary classes by just a click of a button
          </p>
          <Link to="/materials" className="btn btn-warning btn-lg fs-6">
            Get Materials
          </Link>
        </div>
      </div>

      {/* Sections */}
      <div className="container-fluid new-materials mb-2">
        <MaterialsSection
          title="New Materials"
          items={newMaterials}
          sectionRef={newMaterialsRef}
          isLoading={loadingNew}
          emptyMessage="No new materials uploaded in the last 7 days."
        />
        <MaterialsSection
          title="Most Downloaded"
          items={mostDownloaded}
          sectionRef={mostDownloadedRef}
          isLoading={loadingTop}
          emptyMessage="No downloads recorded yet. Be the first to download!"
        />
      </div>

      <Footer />
    </>
  );
}

export default Home;