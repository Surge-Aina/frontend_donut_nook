// Manager & Admin: manage menu itemsi
import Layout from '../../components/Layout';
import PageWrapper from '../../components/PageWrapper';
import MenuItems from '../../components/MenuItems';



const Menu = () => {

  return (
    <Layout>
      <PageWrapper>
        <h1>Manager: Menu</h1>
        <MenuItems/>
      </PageWrapper>
    </Layout>
  );
};

export default Menu;
