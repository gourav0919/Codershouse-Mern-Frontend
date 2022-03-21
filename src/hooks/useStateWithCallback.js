import { useState, useEffect, useCallback, useRef } from "react";

export const useStateWithCallback = (initialState) => {
  // This is same as normal states
  const [state, setState] = useState(initialState);

  // The benefit of using useCallback is this that it can not update in every render

  //   This is used for storing the value store in the useRef to store in the component and then the component will no re render if this value got changed. but in normal state the component re renders.
  //   It is generally used to store the reference which can be changed in many cases when state changes
  // persist value when re renders and did not re render if the value of reference changes
  const cbRef = useRef();

  //   This hook is generally used to improve the rendering behavaious or optimise it or generally used for cacheing purposes.
  //   now our setClient of useWebRTC is taking 2 arguement one is the newState and second is the callback
  //   now if the newState arguement is the function then in the setState it is going to call with the previous value of state and if this is not the function then the setState will got the newState value simply
  //   so now we make the state change to use the functional approach which is good for state change due to asynchronous nature of react and it also helps us in getting our work done so we can add new clients easily without affecting the previous clients now you understand what i want to say
  //   We are providing empty dependency list but the reason i did not know
  const updateState = useCallback((newState, callb) => {
    // Assigning callback function which we receive to a reference
    cbRef.current = callb;

    setState((prev) => {
      //   if anyone is passing function then simply call it and give the previous state to the function and if the data is coming then give the data
      //   This you can understand easily
      return typeof newState === "function" ? newState(prev) : newState;
    });
  }, []);

  useEffect(() => {
    //   now here after doing the state update calling that callback function via the reference by passing the new state to it
    // This is the main task that we have to achieve that is calling the callback which we are doing now
    // When we did not perform the state update then the function is not assigned to him and it is empty for the first time so it is false and it did not run
    if (cbRef.current) {
      cbRef.current(state);
      // And then assigning the null to reference because we call it once and now we did not have any work related to it
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
