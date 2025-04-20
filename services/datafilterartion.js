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

          const emptyFields = step1Requiredfields.filter(field => 
            field in data && data[field].trim() === ""
          );
          
          if (emptyFields.length > 0) {
            hasEmptyField = true
          } else {
            hasEmptyField = false
          }
    
          
    }

    if(step === "step2"){
        filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => step2fields.includes(key))
      );

      const emptyFields = step2Requiredfields.filter(field => 
        field in data && data[field].trim() === ""
      );
      
      if (emptyFields.length > 0) {
        hasEmptyField = true
      } else {
        hasEmptyField = false
      }
    }
    
    if(step === "step3"){
        filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => step3fields.includes(key))
      );

      const emptyFields = step3Requiredfields.filter(field => 
        field in data && data[field].trim() === ""
      );
      
      if (emptyFields.length > 0) {
        hasEmptyField = true
      } else {
        hasEmptyField = false
      }
    }
    
    if(step === "step4"){
        filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => step4fields.includes(key))
      );

      const emptyFields = step4Requiredfields.filter(field => 
        field in data && data[field].trim() === ""
      );
      
      if (emptyFields.length > 0) {
        hasEmptyField = true
      } else {
        hasEmptyField = false
      }
    }
    
    return { filteredData, hasEmptyField };
};
