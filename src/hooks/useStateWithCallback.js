import { useState, useEffect, useCallback, useRef } from "react";

// When i come in this file for the re-render purposes we did not create a new state else we used the state which we created at the time of first time render of this usestatewithcallback
export const useStateWithCallback = (initialState) => {
  console.log("inside useState with Callback hook!");

  // This is same as normal states
  const [state, setState] = useState(initialState);
  console.log(state);

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
  // We are providing empty dependency list which says that this function is memorised first and then it is not created everytime for every re render
  const updateState = useCallback((newState, callb) => {
    // Assigning callback function which we receive to a reference
    cbRef.current = callb;

    // This state always empty because we are calling update state for a webRTC but at this time the state is empty when it going to update it shows the results.
    // catch state
    console.log(state);

    setState((prev) => {
      console.log("Previous state :- ", prev);
      //   if anyone is passing function then simply call it and give the previous state to the function and if the data is coming then give the data
      //   This you can understand easily
      return typeof newState === "function" ? newState(prev) : newState;
    });

    // so now i understand what is happened when a state update
    // It leaves a pointer after the setState or where the state update happens then it force the component to re-render. So the component is going for the re-render and then when it comes to this

    // After the happening of this the componet rendering is permanent

    // As same this also not execute because in this state update which is affecting and going to the main Room component so this will going to re render the component itself.
    // Now this is running after the re-rendering of the component react come to this place and decided i left at this place for the component re-rendering due to the state update
    // This console.log is running also with the empty value of the state every time i don't know why
    // This is the catch state so now it is showing us the catch state not the original one
    // Catch state at the initial times
    console.log(state);
  }, []);

  // Mainly the work done is here when the state is update it means this is going to run definitely and in this now we are calling the callback function which we receive as a arguement from the setClient and store it in cbref and now is the time to call it
  // This useEffect will run after the state update
  useEffect(() => {
    // This is actually running after the state update and giving us the full new state
    console.log(state);
    console.log("inside useEffect of usestatewithcallback.");
    //   now here after doing the state update calling that callback function via the reference by passing the new state to it
    // This is the main task that we have to achieve that is calling the callback which we are doing now
    // When we did not perform the state update then the function is not assigned to him and it is empty for the first time so it is false and it did not run
    // after the rendering this useEffect will run first
    if (cbRef.current) {
      cbRef.current(state);
      // And then assigning the null to reference because we call it once and now we did not have any work related to it
      cbRef.current = null;
    }
  }, [state]);

  // Actually state is update here and then when the component starts the re-rendering because of state update now when the component reaches this hook then it returs the updated state without the running of the useEffect so the updated state is pass to the useWebRTC hook
  return [state, updateState];
};

// we are returning without the execution of the useEffect hook which is the behaviour and then the component is going to rendered first and then the useEffect will run
// The main thing is also the lower the useEffect is execute first it means that if we call a useEffect in the lower file means in any other file like we have in useWebRTC and in useStateWithCallback we have useEffect also so firstly after component render the useEffect of stateWithCallback will run first and then the useWebRTC hook useEffects

// one more thing that i learned is that the component re-render is not the new render.
// New render is what when the component renders in the dom for the first time but the re-render is the finding the depencies that using that state and then update those dom elements with the new state values.

// import { useState, useEffect, useCallback, useRef } from "react";

// export const useStateWithCallback = (initialState) => {
//   console.log("inside useState with Callback hook!");

//   const [state, setState] = useState(initialState);
//   console.log(state);

//   const cbRef = useRef();

//   const updateState = useCallback((newState, callb) => {
//     // Assigning callback function which we receive to a reference
//     cbRef.current = callb;

//     console.log(state);

//     setState(
//       (prev) => {
//         console.log("Previous state :- ", prev);
//         return typeof newState === "function" ? newState(prev) : newState;
//       }
//     );
//     console.log(state);
//   }, []);

//   useEffect(() => {
//     console.log(state);
//     console.log("inside useEffect of usestatewithcallback.");

//     if (cbRef.current) {
//       cbRef.current(state);

//       cbRef.current = null;
//     }
//   }, [state]);

//   return [state, updateState];
// };
