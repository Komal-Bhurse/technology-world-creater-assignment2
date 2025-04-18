export const FilterRequiredData = (step, data) => {
  const step1fields = [ "firstName","middleName","lastName","mobile","dob","gender","newBusiness","farmerPhoto"];

  const step1Requiredfields = [ "firstName","middleName","lastName","mobile","dob","gender","farmerPhoto"];


  const step2fields = ["state","district","taluka","village","pincode","streetAddress","residencialType"];
  const step2Requiredfields = ["state","district","taluka","village","pincode","streetAddress"];

  const step3fields = ["farmerType","cropsGrown","whereYouSell"];
  const step3Requiredfields = ["farmerType"];

  const step4fields = ["landState","landDistrict","landTaluka","landServeyNo","landSubServeyNo","landownerName"];
  const step4Requiredfields = ["landState","landDistrict","landTaluka","landServeyNo","landSubServeyNo","landownerName"];

  let filteredData;
  let hasEmptyField;

  
    if(step === "step1"){
          filteredData = Object.fromEntries(
            Object.entries(data).filter(([key]) => step1fields.includes(key))
          );
    
          hasEmptyField = step1Requiredfields.some(
            (key) =>
            filteredData[key] === "" ||
            filteredData[key] === null ||
            filteredData[key] === undefined
          );
    }

    if(step === "step2"){
        filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => step2fields.includes(key))
      );

      hasEmptyField = step2Requiredfields.some(
        (key) =>
          filteredData[key] === "" ||
          filteredData[key] === null ||
          filteredData[key] === undefined
      );
    }
    
    if(step === "step3"){
        filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => step3fields.includes(key))
      );

      hasEmptyField = step3Requiredfields.some(
        (key) =>
          filteredData[key] === "" ||
          filteredData[key] === null ||
          filteredData[key] === undefined
      );
    }
    
    if(step === "step4"){
        filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => step4fields.includes(key))
      );

      hasEmptyField = step4Requiredfields.some(
        (key) =>
          filteredData[key] === "" ||
          filteredData[key] === null ||
          filteredData[key] === undefined
      );
    }
    
    return { filteredData, hasEmptyField };
};
