// Icons
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
export const sideBarLinks = [
  {
    text: 'Home',
    route: '/',
    isAdmin: false,
    icon: <HomeIcon />
  },
  {
    text: 'Students',
    route: '/students',
    isAdmin: true,
    icon: <PeopleIcon />
  },
  {
    text: 'Departments',
    route: '/departments',
    isAdmin: true,
    icon: <AccountBalanceIcon />
  },
  {
    text: 'Subjects',
    route: '/subjects',
    isAdmin: true,
    icon: <MenuBookIcon />
  },
  {
    text: 'Academic Years',
    route: '/years',
    isAdmin: true,
    icon: <DateRangeIcon />
  },

  {
    text: 'Semesters',
    route: '/semesters',
    isAdmin: true,
    icon: <ScheduleIcon />
  },
  {
    text: 'Courses',
    route: '/courses',
    isAdmin: true,
    icon: <LibraryBooksIcon />
  },
  {
    text: 'Enrollments',
    route: '/enrollments',
    isAdmin: false,
    icon: <AddCircleOutlineIcon />
  }
];
