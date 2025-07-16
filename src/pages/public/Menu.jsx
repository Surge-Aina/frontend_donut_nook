import Layout from '../../components/Layout';
import MenuItems from '../../components/MenuItems';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/PageWrapper';


const Menu = () => (
  <Layout>
    <div className="menu-page-container">
      {/* removed the static menu here since it was messing with my favorite icon page */}
      <div className="p-4">
        <MenuItems/>
      </div>
    </div>
  </Layout>
);

export default Menu;
