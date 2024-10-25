const times = {
  startTime: 8,
  endTime: 20,
};

export default async function Home() {
  const fetchedData = await fetch("http://localhost:8080/api/notion/data").then(
    (res) => res.json()
  );

  const data: { [key: string]: EventType[] } = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  fetchedData.forEach((event: EventType) => {
    if (!data[event.Day]) {
      if (event.Day == "") {
        return;
      }
      throw new Error("Invalid day:" + event.Day);
    }
    data[event.Day].push(event);
  });

  if (data.Saturday.length === 0) {
    delete data.Saturday;
  }
  if (data.Sunday.length === 0) {
    delete data.Sunday;
  }

  return (
    <div className="h-full bg-zinc-900 text-white grid items-center p-12  font-mono">
      <Timetable data={data} />
    </div>
  );
}

type TimetableProps = {
  data: { [key: string]: EventType[] };
};

async function Timetable({ data }: TimetableProps) {
  return (
    <div className="h-full p-4 gap-4 flex flex-col">
      <h1 className="text-5xl my-4 ">Timetable</h1>
      <div className="relative h-full">
        <div className="h-full w-full flex justify-between gap-8">
          {Object.keys(data).map((dayName) => (
            <Day dayName={dayName} key={dayName} events={data[dayName]} />
          ))}
        </div>
        <div className="absolute t-0 l-0 "></div>
      </div>
    </div>
  );
}

type DayProps = {
  dayName: string;
  events: EventType[];
};

function Day({ dayName, events }: DayProps) {
  return (
    <div className="h-full w-full flex flex-col capitalize rounded-md">
      <h2 className="text-2xl font-thin p-4 text-center w-full rounded-md">
        {dayName}
      </h2>
      <EventContainer events={events} />
    </div>
  );
}

type EventContainerProps = {
  events: EventType[];
};
function EventContainer({ events }: EventContainerProps) {
  return (
    <div className="h-full w-full relative bg-zinc-800 rounded-lg">
      {events.map((event, i) => (
        <Event event={event} key={i} />
      ))}
    </div>
  );
}

type EventProps = {
  event: EventType;
};

type EventType = {
  Title: string;
  StartTime: number;
  EndTime: number;
  Color: keyof typeof COLORS;
  Type: string; // for example: lecture, tutorial
  Day: string;
};

function Event({ event }: EventProps) {
  console.log(event);

  return (
    <div
      className="w-full absolute"
      style={{
        height: `${
          ((event.EndTime - event.StartTime) /
            (times.endTime - times.startTime)) *
          100
        }%`,
        top: `${
          ((event.StartTime - times.startTime) /
            (times.endTime - times.startTime)) *
          100
        }%`,
      }}
    >
      <div
        className="m-3 p-4 pl-6 rounded-md h-full relative"
        style={{
          backgroundColor: COLORS[event.Color].light,
        }}
      >
        <div
          className="absolute top-0 left-0 rounded-md rounded-e-none w-2 h-full"
          style={{
            backgroundColor: COLORS[event.Color].dark,
          }}
        />
        <h3 className="text-xl font-bold truncate">{event.Title}</h3>
        <p className="text-sm">
          {event.Type} <br />
          {event.StartTime} - {event.EndTime}
        </p>
      </div>
    </div>
  );
}

const COLORS = {
  // Test colors
  Pink: { light: "#3D405B", dark: "#1F202E" },
  // Done colors
  Orange: { light: "#CE8147", dark: "#885630" },
  Red: { light: "#653239", dark: "#402024" },
  Green: { light: "#566246", dark: "#363E2C" },
  LightBlue: { light: "#759AAB", dark: "#4A616C" },
  DarkBlue: { light: "#3D405B", dark: "#1F202E" },
  Yellow: { light: "#E0A93D", dark: "#A0792C" },
  // Done colors with exotic names
  Caramel: { light: "#CE8147", dark: "#885630" },
  Wine: { light: "#653239", dark: "#402024" },
  Olive: { light: "#566246", dark: "#363E2C" },
  SmurfIce: { light: "#759AAB", dark: "#4A616C" },
  Blueberry: { light: "#3D405B", dark: "#1F202E" },
  Sunny: { light: "#E0A93D", dark: "#A0792C" },
};
