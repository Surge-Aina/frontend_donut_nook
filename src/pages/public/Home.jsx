import React from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const Home = () => (
  <Layout>
    <section className="flex flex-col items-center justify-center w-full px-4 py-8 min-h-[calc(100vh-120px)]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-5xl mt-8 items-center justify-center">
        {/* Mascot png */}
        <div className="flex-shrink-0 flex justify-center mb-8 lg:mb-0">
          <img
            src="img/donut-mascot.png"
            alt="Donut Nook Mascot"
            className="max-w-[320px] w-full h-auto"
            style={{ minWidth: 0, maxWidth: '320px', maxHeight: '380px' }}
          />
        </div>
        {/* Temp text content */}
        <div className="flex flex-col items-start text-left max-w-lg">
          <h1 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: "#3d2b1f" }}>
            Hot Glazed <span style={{ color: "#E4AD2C" }}>Goodness</span>
            <br />
            Since Forever!
          </h1>
          <p className="mb-8 text-lg md:text-xl" style={{ color: "#3D2B1E" }}>
            Familiar treats, cartoon charm, and a sprinkle of magic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-start">
            <Link to="/order" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto">
                Order Now
              </button>
            </Link>
            <Link to="/menu" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto">
                See Menu
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Home;
