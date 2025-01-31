import { useState, useEffect } from "react";

function OptionTwo() {
  const [groups, setGroups] = useState(() => {
    const storedGroups = localStorage.getItem("groups_option_two");
    return storedGroups ? JSON.parse(storedGroups) : {};
  });

  const [name, setName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newSubGroupName, setNewSubGroupName] = useState("");
  const [subGroupFor, setSubGroupFor] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Track selected subgroups
  const [selectedSubGroup, setSelectedSubGroup] = useState([]);

  // Add a state to track the group for which the modal is open
  const [groupForSubgroup, setGroupForSubgroup] = useState("");

  // Save groups data to localStorage
  useEffect(() => {
    localStorage.setItem("groups_option_two", JSON.stringify(groups));
  }, [groups]);

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    setGroups((prevGroups) => ({
      ...prevGroups,
      [newGroupName]: { people: [], subgroups: {} },
    }));
    setNewGroupName("");
  };

  const addPerson = () => {
    if (!name.trim() || !selectedGroup) return;

    setGroups((prevGroups) => {
      const updatedGroups = { ...prevGroups };
      if (!updatedGroups[selectedGroup]) return updatedGroups;

      updatedGroups[selectedGroup] = {
        ...updatedGroups[selectedGroup],
        people: [...updatedGroups[selectedGroup].people, name],
      };

      return updatedGroups;
    });

    setName("");
    setSelectedGroup("");
  };

  const addSubGroup = () => {
    if (!newSubGroupName.trim() || !subGroupFor) return;

    setGroups((prevGroups) => {
      const updatedGroups = { ...prevGroups };
      if (!updatedGroups[subGroupFor]) return updatedGroups;

      updatedGroups[subGroupFor].subgroups[newSubGroupName] = {
        people: [],
        subgroups: {},
      };

      return updatedGroups;
    });

    setNewSubGroupName("");
    setSubGroupFor("");
  };

  const removePerson = (groupName, person) => {
    setGroups((prevGroups) => {
      const updatedGroups = { ...prevGroups };
      updatedGroups[groupName].people = updatedGroups[groupName].people.filter(
        (p) => p !== person
      );
      return updatedGroups;
    });
  };

  const removeGroup = (groupName) => {
    setGroups((prevGroups) => {
      const updatedGroups = { ...prevGroups };
      delete updatedGroups[groupName];
      return updatedGroups;
    });
  };

  const addPersonToSubgroup = () => {
    if (!selectedPerson || !selectedSubGroup.length) return;

    setGroups((prevGroups) => {
      const updatedGroups = { ...prevGroups };

      selectedSubGroup.forEach((subgroup) => {
        // Iterate through groups to find the correct subgroup to add the person to
        Object.keys(updatedGroups).forEach((groupName) => {
          const group = updatedGroups[groupName];

          // If the group has the subgroup, add the person to it
          if (group.subgroups[subgroup]) {
            group.subgroups[subgroup].people = [
              ...group.subgroups[subgroup].people,
              selectedPerson,
            ];
          }
        });
      });

      return updatedGroups;
    });

    // Clear the modal and reset state
    setShowModal(false);
    setSelectedSubGroup([]); // Reset selected subgroups after adding
  };

  // Helper function to get subgroups for a person
  const getSubgroupsForPerson = (person) => {
    let subgroups = [];

    // Go through all the groups and subgroups to check which ones the person belongs to
    Object.keys(groups).forEach((group) => {
      Object.keys(groups[group].subgroups).forEach((subgroup) => {
        // If the person is in the subgroup, add it to the list
        if (groups[group].subgroups[subgroup].people.includes(person)) {
          subgroups.push(subgroup);
        }
      });
    });

    return subgroups; // Only return the subgroups the person belongs to
  };

  return (
    <div className="min-h-screen bg-gray-900 flex gap-6 p-6 w-full">
      <div className="flex flex-col gap-[16px] flex-grow max-w-xl">
        {/* Create Group */}
        <div className="bg-gray-800 p-6 rounded-lg w-full flex flex-col">
          <p className="text-2xl mb-2">Create a Group</p>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter new group name"
            className="px-4 py-2 mb-[16px] border rounded-lg bg-gray-800 focus:outline-none"
          />
          <button
            onClick={createGroup}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Create
          </button>
        </div>

        {/* Add Subgroup */}
        <div className="bg-gray-800 p-6 rounded-lg w-full">
          <p className="text-2xl mb-2">Create a Subgroup</p>
          <input
            type="text"
            value={newSubGroupName}
            onChange={(e) => setNewSubGroupName(e.target.value)}
            placeholder="Enter new subgroup name"
            className="px-4 py-2 border rounded-lg bg-gray-800 focus:outline-none w-full"
          />
          <div className="mt-2">
            <p>Select Parent Group:</p>
            {Object.keys(groups).map((group) => (
              <div key={group} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subGroupSelect"
                  value={group}
                  checked={subGroupFor === group}
                  onChange={(e) => setSubGroupFor(e.target.value)}
                />
                <label>{group}</label>
              </div>
            ))}
          </div>
          <button
            onClick={addSubGroup}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 w-full"
          >
            Create Subgroup
          </button>
        </div>

        {/* Add Person */}
        <div className="bg-gray-800 p-6 rounded-lg w-full">
          <p className="text-2xl mb-2">Add a Person</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="px-4 py-2 border rounded-lg bg-gray-800 focus:outline-none w-full"
          />
          <div className="mt-2">
            <p>Select Group:</p>
            {Object.keys(groups).map((group) => (
              <div key={group} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="groupSelect"
                  value={group}
                  checked={selectedGroup === group}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                />
                <label>{group}</label>
              </div>
            ))}
          </div>
          <button
            onClick={addPerson}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 w-full"
          >
            Add
          </button>
        </div>
      </div>

      {/* Display Groups */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
        <p className="text-2xl mb-2">Groups</p>
        {Object.keys(groups).map((group) => (
          <div key={group} className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl mb-[32px]">{group}</h2>
              <button
                onClick={() => removeGroup(group)}
                className="bg-red-500 text-white px-2 py-1 rounded-lg"
              >
                Remove group
              </button>
            </div>
            <ul className="flex flex-col gap-[8px]">
              {groups[group].people.map((person, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-900 p-[16px] rounded-lg"
                >
                  <div className="flex flex-col">
                    {person}
                    <div className="text-sm text-gray-400">
                      Subgroups:{" "}
                      {getSubgroupsForPerson(person).length > 0 ? (
                        getSubgroupsForPerson(person).join(", ")
                      ) : (
                        <span className="text-gray-600">No subgroups</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-[8px]">
                    <button
                      onClick={() => {
                        setSelectedPerson(person);
                        setShowModal(true);
                        setGroupForSubgroup(group); // Track which group the modal is for
                      }}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                    >
                      Add to a sub group
                    </button>
                    <button
                      onClick={() => removePerson(group, person)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg w-[80%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl mb-4">
              Select Subgroups for {selectedPerson}
            </h2>
            <div>
              {/* Only show subgroups for the group that the person belongs to */}
              {groups[groupForSubgroup] &&
              groups[groupForSubgroup].subgroups ? (
                <div>
                  <p className="text-lg">{groupForSubgroup}</p>
                  {Object.keys(groups[groupForSubgroup].subgroups).map(
                    (subgroup) => (
                      <div key={subgroup} className="flex gap-2">
                        <input
                          type="checkbox"
                          id={subgroup}
                          value={subgroup}
                          checked={selectedSubGroup.includes(subgroup)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedSubGroup((prevSelected) =>
                              prevSelected.includes(value)
                                ? prevSelected.filter((sub) => sub !== value)
                                : [...prevSelected, value]
                            );
                          }}
                        />
                        <label htmlFor={subgroup}>{subgroup}</label>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
            <button
              onClick={addPersonToSubgroup}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Add to Subgroups
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptionTwo;
