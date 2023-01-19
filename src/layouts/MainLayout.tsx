import { Fragment, FunctionComponent, ReactNode } from "react";
import { NavBar } from "src/components/NavBar";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <Fragment>
      <NavBar />
      <div>
        { children }
      </div>
    </Fragment>
  ); 
}
