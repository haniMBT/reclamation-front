<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-primary">
          <div class="row items-center">
            <q-icon name="school" size="md" class="q-mr-sm" />
            <span class="text-weight-bold">Sunshine Primary</span>
          </div>
        </q-toolbar-title>

        <q-input
          dense
          outlined
          v-model="search"
          placeholder="Search..."
          class="q-mr-md bg-white"
          style="width: 300px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn round flat icon="notifications">
          <q-badge color="red" floating>3</q-badge>
          <q-menu>
            <q-list style="min-width: 250px">
              <q-item-label header>Notifications</q-item-label>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>New student registration</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Staff meeting reminder</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Grade reports due</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn flat no-caps class="q-ml-sm">
          <div class="row items-center no-wrap">
            <q-avatar size="32px">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <div class="q-ml-sm q-mr-xs">
              <div class="text-weight-bold text-dark">Sarah Johnson</div>
              <div class="text-caption">Administrator</div>
            </div>
            <q-icon name="arrow_drop_down" size="16px" />
          </div>

          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer / Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :breakpoint="1023"
      class="bg-white"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-uppercase text-grey-6 q-my-sm">Main</q-item-label>
          <q-item clickable v-ripple to="/dashboard" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/students" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>Students</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/teachers" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Teachers</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/classes" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>
            <q-item-section>Classes</q-item-section>
          </q-item>

          <q-item-label header class="text-uppercase text-grey-6 q-my-sm">Academic</q-item-label>
          <q-item clickable v-ripple to="/attendance" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="fact_check" />
            </q-item-section>
            <q-item-section>Attendance</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/grades" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>Grades</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/schedule" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="event" />
            </q-item-section>
            <q-item-section>Schedule</q-item-section>
          </q-item>

          <q-item-label header class="text-uppercase text-grey-6 q-my-sm">Communication</q-item-label>
          <q-item clickable v-ripple to="/messages" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>Messages</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/announcements" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="campaign" />
            </q-item-section>
            <q-item-section>Announcements</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/email" active-class="bg-primary-1 text-primary">
            <q-item-section avatar>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>Email</q-item-section>
          </q-item>
        </q-list>

        <q-separator />

        <div class="q-pa-md">
          <div class="row items-center">
            <q-avatar size="32px">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <div class="q-ml-sm">
              <div class="text-weight-bold">Sarah Johnson</div>
              <div class="text-caption">Administrator</div>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <q-page padding>
        <!-- Dashboard Header -->
        <div class="q-mb-lg">
          <div class="text-h4 text-weight-bold q-mb-xs">Dashboard</div>
          <div class="text-grey-8">Welcome back, Sarah! Here's what's happening today.</div>
        </div>

        <!-- Stats Overview -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stats-card" style="border-left: 4px solid #10b981">
              <q-card-section>
                <div class="text-caption text-grey-8">Total Students</div>
                <div class="text-h4 q-mt-sm q-mb-xs">342</div>
                <div class="text-caption text-grey-8">+12 from last month</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stats-card" style="border-left: 4px solid #3b82f6">
              <q-card-section>
                <div class="text-caption text-grey-8">Total Teachers</div>
                <div class="text-h4 q-mt-sm q-mb-xs">28</div>
                <div class="text-caption text-grey-8">+2 new this semester</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stats-card" style="border-left: 4px solid #f59e0b">
              <q-card-section>
                <div class="text-caption text-grey-8">Classes</div>
                <div class="text-h4 q-mt-sm q-mb-xs">16</div>
                <div class="text-caption text-grey-8">Across all grades</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stats-card" style="border-left: 4px solid #8b5cf6">
              <q-card-section>
                <div class="text-caption text-grey-8">Attendance Rate</div>
                <div class="text-h4 q-mt-sm q-mb-xs">96.8%</div>
                <div class="text-caption text-grey-8">+1.2% from last week</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Main Content Sections -->
        <div class="row q-col-gutter-md q-mt-md">
          <!-- Upcoming Events -->
          <div class="col-12 col-md-6 col-lg-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Upcoming Events</div>
                <div class="text-caption text-grey-8">Events for the next 7 days</div>
              </q-card-section>

              <q-card-section>
                <q-list>
                  <q-item v-for="(event, index) in upcomingEvents" :key="index" class="q-py-md">
                    <q-item-section avatar>
                      <q-avatar :color="event.color" text-color="white" icon="event" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ event.title }}</q-item-label>
                      <q-item-label caption>{{ event.time }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat color="primary" label="View All Events" />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Recent Announcements -->
          <div class="col-12 col-md-6 col-lg-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Recent Announcements</div>
                <div class="text-caption text-grey-8">Latest school announcements</div>
              </q-card-section>

              <q-card-section>
                <q-list>
                  <q-item v-for="(announcement, index) in announcements" :key="index" class="q-py-md">
                    <q-item-section>
                      <div class="row justify-between items-center q-mb-xs">
                        <q-item-label>{{ announcement.title }}</q-item-label>
                        <q-badge
                          outline
                          :color="announcement.badgeColor"
                          :label="announcement.badgeText"
                          class="q-px-sm"
                        />
                      </div>
                      <q-item-label caption class="q-mb-xs">{{ announcement.content }}</q-item-label>
                      <q-item-label caption class="text-grey-6">{{ announcement.time }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat color="primary" label="View All Announcements" />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Pending Tasks -->
          <div class="col-12 col-md-6 col-lg-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Pending Tasks</div>
                <div class="text-caption text-grey-8">Tasks requiring your attention</div>
              </q-card-section>

              <q-card-section>
                <q-list>
                  <q-item v-for="(task, index) in pendingTasks" :key="index" class="q-py-md">
                    <q-item-section>
                      <div class="row justify-between items-center">
                        <div>
                          <q-item-label>{{ task.title }}</q-item-label>
                          <q-item-label caption>{{ task.dueDate }}</q-item-label>
                        </div>
                        <q-badge
                          outline
                          :color="task.priorityColor"
                          :label="task.priority"
                          class="q-px-sm"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat color="primary" label="View All Tasks" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

// Sidebar state
const leftDrawerOpen = ref(false);
const search = ref('');

// Sample data for the dashboard
const upcomingEvents = [
  {
    title: 'Parent-Teacher Conference',
    time: 'Today, 3:00 PM - 7:00 PM',
    color: 'primary'
  },
  {
    title: 'Science Fair',
    time: 'Tomorrow, 9:00 AM - 12:00 PM',
    color: 'amber'
  },
  {
    title: 'Staff Development Day',
    time: 'Friday, All Day',
    color: 'green'
  },
  {
    title: 'Field Trip - Grade 3',
    time: 'Next Monday, 8:30 AM - 2:30 PM',
    color: 'blue'
  }
];

const announcements = [
  {
    title: 'School Closure - Weather Alert',
    content: 'School will be closed tomorrow due to expected severe weather conditions. Stay safe!',
    time: 'Posted 2 hours ago',
    badgeText: 'Important',
    badgeColor: 'negative'
  },
  {
    title: 'Annual Sports Day',
    content: 'The annual sports day will be held on May 15th. All students are encouraged to participate.',
    time: 'Posted yesterday',
    badgeText: 'Event',
    badgeColor: 'warning'
  },
  {
    title: 'New Library Books',
    content: 'Our library has received 200 new books. Students can check them out starting next week.',
    time: 'Posted 2 days ago',
    badgeText: 'Update',
    badgeColor: 'positive'
  }
];

const pendingTasks = [
  {
    title: 'Review Grade 5 Report Cards',
    dueDate: 'Due in 2 days',
    priority: 'High',
    priorityColor: 'negative'
  },
  {
    title: 'Approve Field Trip Requests',
    dueDate: 'Due tomorrow',
    priority: 'Medium',
    priorityColor: 'warning'
  },
  {
    title: 'Update Staff Directory',
    dueDate: 'Due in 3 days',
    priority: 'Low',
    priorityColor: 'positive'
  },
  {
    title: 'Finalize Budget Proposal',
    dueDate: 'Due in 1 week',
    priority: 'High',
    priorityColor: 'negative'
  },
  {
    title: 'Schedule Teacher Evaluations',
    dueDate: 'Due in 5 days',
    priority: 'Medium',
    priorityColor: 'warning'
  }
];
</script>

<style scoped>
.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Custom color for primary with opacity */
.bg-primary-1 {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
