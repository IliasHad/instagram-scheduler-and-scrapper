import React, { useState, useEffect } from "react";
import { DAYS, MONTH_NAMES } from "../constants/index";
import { Layout } from "../components/layout";

export const Calendar = () => {
  let today = new Date();
  let year = today.getFullYear();
  const [no_of_dats, setNo_of_dats] = useState([]);
  const [blankdays, setBlankdays] = useState([]);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [caption, setCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [month, setMonth] = useState(today.getMonth());
  const [image, setImage] = useState("");

  const getNoOfDays = () => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // find where to start calendar day of week
    let dayOfWeek = new Date(year, month).getDay();
    let blankdaysArray = [];
    for (var blank = 1; blank <= dayOfWeek; blank++) {
      blankdaysArray.push(blank);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankdays(blankdaysArray);
    setNo_of_dats(daysArray);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];

    e.preventDefault();

    var formdata = new FormData();
    formdata.append("image", file);

    var requestOptions = {
      method: "POST",
      body: formdata,
    };

    fetch("http://localhost:8030/upload", requestOptions)
      .then((response) => response.text())
      .then((result) => setImage(result))
      .catch((error) => console.log("error", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      caption,
      image,
      scheduledDate,
    };
    fetch("http://localhost:8030/schedule", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => setOpenEventModal(false))
      .catch((error) => console.log("error", error));
  };
  const isToday = (date) => {
    const today = new Date();
    const d = new Date(year, month, date);

    return today.toDateString() === d.toDateString() ? true : false;
  };

  const showEventModal = (date) => {
    // open the modal

    setOpenEventModal(true);

    setScheduledDate(new Date(year, month, date).toLocaleDateString());
  };

  useEffect(() => {
    getNoOfDays();
  }, [month]);

  return (
    <Layout title="Scheduled Posts">
      <div>
        <div className="antialiased sans-serif bg-gray-100 h-screen">
          <div className="container mx-auto px-4 py-2 md:py-24">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex items-center justify-between py-2 px-6">
                <div>
                  <span className="text-lg font-bold text-gray-800">
                    {MONTH_NAMES[month]}
                  </span>
                  <span className="ml-1 text-lg text-gray-600 font-normal">
                    {year}
                  </span>
                </div>
                <div
                  className="border rounded-lg px-1"
                  style={{ paddingTop: "2px" }}
                >
                  <button
                    type="button"
                    className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                    className={
                      month === 0 ? "cursor-not-allowed opacity-25" : ""
                    }
                    disabled={month === 0 ? true : false}
                    onClick={() =>
                      setMonth((prevMonth) => prevMonth - 1) && getNoOfDays()
                    }
                  >
                    <svg
                      className="h-6 w-6 text-gray-500 inline-flex leading-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="border-r inline-flex h-6"></div>
                  <button
                    type="button"
                    className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                    className={
                      month === 11 ? "cursor-not-allowed opacity-25" : ""
                    }
                    disabled={month === 11 ? true : false}
                    onClick={() =>
                      setMonth((prevMonth) => prevMonth + 1) && getNoOfDays()
                    }
                  >
                    <svg
                      className="h-6 w-6 text-gray-500 inline-flex leading-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="-mx-1 -mb-1">
                <div
                  className="flex flex-wrap"
                  style={{ marginBottom: "-40px" }}
                >
                  {DAYS.map((day, index) => (
                    <div
                      key={index}
                      style={{ width: "14.26%" }}
                      className="px-2 py-2"
                    >
                      <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap border-t border-l">
                  {blankdays.map((blankday, key) => (
                    <div
                      key={key}
                      style={{ width: "14.28%", height: "120px" }}
                      className="text-center border-r border-b px-4 pt-2"
                    ></div>
                  ))}

                  {no_of_dats.map((date, index) => (
                    <div
                      key={index}
                      style={{ width: "14.28%", height: "120px" }}
                      className="px-4 pt-2 border-r border-b relative"
                    >
                      <div
                        onClick={() => showEventModal(date)}
                        className="inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100"
                        className={
                          isToday(date) === true
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-blue-200"
                        }
                      >
                        {date}
                      </div>
                      <div
                        style={{ height: "80px" }}
                        className="overflow-y-auto mt-1"
                      >
                        {events
                          .filter(
                            (event) =>
                              event.date ===
                              new Date(year, month, date).toDateString()
                          )
                          .map((event, index) => (
                            <div
                              key={index}
                              className="absolute top-0 right-0 mt-2 mr-2 inline-flex items-center justify-center rounded-full text-sm w-6 h-6 bg-gray-700 text-white leading-none"
                            >
                              {event.title}
                            </div>
                          ))}

                        {events
                          .filter(
                            (event) =>
                              new Date(event.date).toDateString() ===
                              new Date(year, month, date).toDateString()
                          )
                          .map((event, index) => (
                            <div
                              key={index}
                              className="px-2 py-1 rounded-lg mt-1 overflow-hidden border"
                            >
                              <p className="text-sm truncate leading-tight">
                                {event.title}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {openEventModal && (
            <form
              style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
              className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
            >
              <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
                <div
                  className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
                  // onclick="openEventModal = !openEventModal"
                >
                  <svg
                    className="fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
                  </svg>
                </div>

                <div className="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8">
                  <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                    Add Post Details
                  </h2>

                  <div className="mb-4">
                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                      Caption
                    </label>
                    <textarea
                      onChange={(e) => setCaption(e.target.value)}
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                      Scheduled Date
                    </label>

                    {console.log(`${scheduledDate}T00:00`)}
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="datetime-local"
                      name="meeting-time"
                      required
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                      Image
                    </label>
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={onFileChange}
                    />
                  </div>

                  <div className="mt-8 text-right">
                    <button
                      type="button"
                      className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                      onClick={() => setOpenEventModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm"
                      onClick={handleSubmit}
                    >
                      Save Post
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};
