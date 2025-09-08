import { redirect } from "vike/abort";
import { PageContextServer } from "vike/types";
export { guard };


const guard = async (pageContext: PageContextServer) => {
  // console.log(pageContext.urlOriginal, pageContext.urlParsed, pageContext.headers);
};
