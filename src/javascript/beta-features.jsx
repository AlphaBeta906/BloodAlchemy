import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import UserContext from "./userContext";
import Error from "./error";
import Alert from "./alert";

function getResult(combination, dict) {
  const new_comb = combination.split("+").sort().join("+");

  for (let comb in dict) {
    var try_comb = comb.split("+").sort().join("+");

    if (try_comb === new_comb) {
      return dict[comb];
    }
  }

  return false;
}

function requires(elements, inventory) {
  var requires = {};

  elements.forEach((element) => {
    if (requires[element] === undefined) {
      requires[element] = 1;
    }
  });

  for (let element in elements) {
    if (inventory[elements[element]] === undefined || inventory[elements[element]] < requires[elements[element]]) {
      return false;
    } else {
      requires[element] += 1;
    }
  }

  return true;
}

export default function BETAFeatures() {
  const { user } = useContext(UserContext);
  const { register, handleSubmit } = useForm();

  const [result, setResult] = useState("");

  const x = [...Array(4).keys()].splice(2, 4 - 2);

  const onSubmit = (data) => {
    const inventory = {"Fire": 3};
    const reactions = {"Fire+Water+Earth+Air": "Element", "Fire+Fire+Fire": "WHAT"};

    const combination = [data.e1]

    for (let i = 0; i < x.length; i++) {
      combination.push(data[`e${i + 2}`]);
    }

    if (data[`e${x.length + 1}`] === undefined) {
      setResult(
        <Alert type="warning" message={`You must select ${x.length + 1} elements.`} />
      );
    } else if (requires(combination, inventory) === false) {
      setResult(
        <Alert type="warning" message="You don't have enough of the selected elements." />
      );
    } else {
      const combination2 = combination.join("+");

      if (reactions[combination2] === undefined) {
        setResult(
          <Alert type="info" message={(
            <div>
              No reaction ( {combination2} ) <Link to="/suggest">Suggest?</Link>
            </div>
          )} />
        );
      } else {
        setResult(
          <Alert type="success" message={`${reactions[combination2]} reaction found!`} />
        );
      }
    }
  };

  if (["AlphaBeta906", "ItzCountryballs", "Nv7"].includes(user)) {
    return (
      <div>
        <center>
          <p class="text-2xl">Test Page: 2</p>
          <span class="text-s bg-red-800 px-2 py-1 rounded-full" style={{"fontFamily": "Octin Spraypaint"}}>EXCLUSIVE BETA FEATURE</span><br /><br />
                
          <form onSubmit={handleSubmit(onSubmit)} class="bg-white dark:bg-slate-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
            <input {...register("e1")} placeholder="Element 1" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

            {x.map((item) => {
              return (
                <div>
                  <p style={{fontSize:25, fontWeight:"bold"}}>+</p>
                  <input {...register("e" + item.toString())} placeholder={"Element " + item} class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
              )
            })}<br />
            <input type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" /><br/><br/>
            <p>{result}</p>
          </form>
        </center>
      </div>
    )
  } else {
    return (
      <Error status="404" />
    )
  }
}