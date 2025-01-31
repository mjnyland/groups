import { useState } from "react";

function OptionOne() {
  const [people, setPeople] = useState(
    JSON.parse(localStorage.getItem("people")) || { everyone: [] }
  );
  const [name, setName] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupToAdd, setSelectedGroupToAdd] = useState(null);
  const [peopleToAdd, setPeopleToAdd] = useState([]); // Array to store multiple selected people
  const [isModalOpen, setIsModalOpen] = useState(false); // Add state for modal visibility

  const addPerson = () => {
    if (!name.trim()) return;

    const newPeople = { ...people };

    // Add person to "everyone" group by default
    if (!newPeople.everyone) {
      newPeople.everyone = [];
    }
    newPeople.everyone.push(name);

    // Add person to any other selected groups
    selectedGroups.forEach((group) => {
      if (group !== "everyone") {
        if (!newPeople[group]) {
          newPeople[group] = [];
        }
        newPeople[group].push(name);
      }
    });

    setPeople(newPeople);
    localStorage.setItem("people", JSON.stringify(newPeople));
    setName("");
    setSelectedGroups([]);
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    const newPeople = { ...people, [newGroupName]: [] };
    setPeople(newPeople);
    localStorage.setItem("people", JSON.stringify(newPeople));
    setNewGroupName(""); // Clear input field after creating group
  };

  const removePerson = (group, person) => {
    const newPeople = { ...people };

    // Remove person from the specified group
    newPeople[group] = newPeople[group].filter((p) => p !== person);

    // If the person is removed from "everyone", remove them completely from all groups
    if (group === "everyone") {
      Object.keys(newPeople).forEach((key) => {
        newPeople[key] = newPeople[key].filter((p) => p !== person);
      });
    }

    // If the person was removed from all groups, delete the person
    if (Object.values(newPeople).every((group) => !group.includes(person))) {
      Object.keys(newPeople).forEach((key) => {
        newPeople[key] = newPeople[key].filter((p) => p !== person);
      });
    }

    setPeople(newPeople);
    localStorage.setItem("people", JSON.stringify(newPeople));
  };

  const removeGroup = (group) => {
    if (group === "everyone") return; // Prevent deleting the "everyone" group
    const newPeople = { ...people };
    delete newPeople[group];
    setPeople(newPeople);
    localStorage.setItem("people", JSON.stringify(newPeople));
  };

  const addPeopleToGroup = () => {
    if (!selectedGroupToAdd || peopleToAdd.length === 0) return;
    const newPeople = { ...people };

    // Add selected people to the chosen group
    if (!newPeople[selectedGroupToAdd]) {
      newPeople[selectedGroupToAdd] = [];
    }

    // Add each selected person to the group, but only if they're not already in the group
    peopleToAdd.forEach((person) => {
      if (!newPeople[selectedGroupToAdd].includes(person)) {
        newPeople[selectedGroupToAdd].push(person);
      }
    });

    setPeople(newPeople);
    localStorage.setItem("people", JSON.stringify(newPeople));
    setPeopleToAdd([]); // Clear selected people after adding
    setSelectedGroupToAdd(null); // Close dropdown after adding
    setIsModalOpen(false); // Close the modal after adding people
  };

  return (
    <div className="min-h-screen bg-gray-900 flex gap-[24px] p-6 w-full">
      <div className="flex flex-col gap-[16px] w-full max-w-xl">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-2xl">Create a Group</p>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter new group name"
              className="px-4 py-2 border rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={createGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-4"
            >
              Create Group
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-2xl">Create a person</p>
            <div className="flex flex-col gap-[16px]">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="flex-1 px-4 py-2 border rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="space-y-2">
                {Object.keys(people)
                  .filter((group) => group !== "everyone") // Exclude "everyone" group
                  .map((group) => (
                    <div key={group} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={group}
                        checked={selectedGroups.includes(group)}
                        onChange={(e) => {
                          const newSelectedGroups = e.target.checked
                            ? [...selectedGroups, group]
                            : selectedGroups.filter((g) => g !== group);
                          setSelectedGroups(newSelectedGroups);
                        }}
                      />
                      <label>{group}</label>
                    </div>
                  ))}
              </div>
              <button
                onClick={addPerson}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <p className="text-2xl mb-[16px]">Groups</p>
        <div className="space-y-4">
          {Object.keys(people).map((group) => (
            <div key={group} className="bg-gray-700 p-[16px] rounded-lg">
              <div className="flex justify-between items-center mb-[16px]">
                <h2 className="text-xl text-gray-200">{group}</h2>
                {group !== "everyone" && (
                  <>
                    <div className="flex gap-[8px]">
                      <button
                        onClick={() => removeGroup(group)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete Group
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGroupToAdd(group); // Set group to add people to
                          setIsModalOpen(true); // Open the modal
                        }}
                        className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition"
                      >
                        Add People
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Modal for adding people to the group */}
              {isModalOpen && selectedGroupToAdd === group && (
                <div className="fixed inset-0 bg-black bg-opacity-5 flex justify-center items-center">
                  <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
                    <p className="text-2xl mb-4">
                      Add People to {selectedGroupToAdd}
                    </p>
                    <select
                      multiple
                      value={peopleToAdd}
                      onChange={(e) =>
                        setPeopleToAdd(
                          Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                        )
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {people.everyone.map((person, index) => (
                        <option key={index} value={person}>
                          {person}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addPeopleToGroup}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-4"
                    >
                      Add to Group
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mt-4 ml-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <ul className="space-y-2">
                {people[group].map((person, index) => (
                  <li
                    key={index}
                    className="p-2 bg-gray-900 rounded-lg text-center flex justify-between items-center"
                  >
                    <span>{person}</span>
                    <button
                      onClick={() => removePerson(group, person)}
                      className="bg-red-500 text-white text-sm px-2 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OptionOne;
