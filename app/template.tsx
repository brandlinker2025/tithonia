import type {ReactNode} from "react";
import NavFix from "@/components/nav-fix";

export default function Template({children}:{children:ReactNode}){
  return <><NavFix/>{children}</>;
}
