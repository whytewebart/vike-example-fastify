import { redirect } from "vike/abort";
import { GuardAsync } from "vike/types";
export { guard };


const guard: GuardAsync = async (pageContext) => {
  const { status } = storeToRefs(useHealth(pageContext));
//   console.log('check existing status: ', status.values)
};
