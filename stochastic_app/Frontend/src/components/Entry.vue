<template>
	<v-container>
		<div id="formContainer">
			<v-tabs v-model="tab" show-arrows background-color="blue accent-4" icons-and-text dark grow>
				<v-tabs-slider color="blue darken-4"></v-tabs-slider>
				<v-tab v-for="tab in tabs" :key="tab.name" @change="loggingIn = !loggingIn, show1 = false">
					<v-icon large>{{ tab.icon }}</v-icon>
					<div class="caption py-1">{{ tab.name }}</div>
				</v-tab>
				<v-tab-item>
					<v-card class="px-4">
						<v-card-text>
							<v-form ref="loginForm" v-model="valid" lazy-validation>
								<v-row>
									<v-col cols="12">
										<v-text-field v-model="loginUsername" :rules="[rules.required]" label="Username" prepend-icon="mdi-account-circle" required></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field v-model="loginPassword" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" prepend-icon="mdi-lock" @click:append="show1 = !show1"></v-text-field>
									</v-col>
									<v-spacer></v-spacer>
									<v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
										<v-btn x-large block color="primary" @click="validate">Login</v-btn>
									</v-col>
								</v-row>
							</v-form>
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card class="px-4">
						<v-card-text>
							<v-form ref="registerForm" v-model="valid" lazy-validation>
								<v-row>
									<v-col cols="12">
										<v-text-field v-model="username" :rules="[rules.required]" label="Username" prepend-icon="mdi-account-circle" required></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" prepend-icon="mdi-lock" @click:append="show1 = !show1"></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Confirm Password" prepend-icon="mdi-lock-outline" @click:append="show1 = !show1"></v-text-field>
									</v-col>
									<v-spacer></v-spacer>
									<v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
										<v-btn x-large block color="primary" @click="validate">Register</v-btn>
									</v-col>
								</v-row>
							</v-form>
						</v-card-text>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</div>
		<v-dialog v-model="dialog" max-width="500px">
			<v-card color="#ff6b6b" dark>
				<v-card-title>Error</v-card-title>
				<v-card-text>
					<div>{{errorRes}}<br>{{errorText}}</div>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="black" @click="dialog = !dialog">
						Close
					</v-btn>
				</v-card-actions>
			</v-card>
        </v-dialog>
	</v-container>
</template>

<style scoped>
	#formContainer{
		border-radius: 4px;
		margin: auto;
		margin-top: 50px;
		border: 1px solid black;
		max-width:600px;
		min-width:360px
	}
</style>

<script>
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:5000'
export default {
	name: 'Entry',
	computed: {
		passwordMatch() {
			return () => this.password === this.verify || "Password must match";
		}
	},
	methods: {
		validate() {
			if (this.loggingIn) {
				//API calls
				if(this.$refs.loginForm.validate()) {
					console.log('logg')
					axios.post('/login',{
						username: this.loginUsername,
						password: this.loginPassword
					}).then(response => {
						localStorage.clear()
						localStorage.setItem( 'token', response.data.accessToken )
						console.log(response)
						this.$router.push({name:'Upload'})
					})
					.catch(error => {
						console.log(error)
						this.errorRes = error.message
						this.errorText = 'Username or password incorrect'
						this.dialog = true
					})
				}
			}
			if (!this.loggingIn) {
				if(this.$refs.registerForm.validate()) {
					console.log('regi')
					axios.post('/register',{
						username: this.username,
						password: this.password
					}).then(response => {
						localStorage.clear()
						localStorage.setItem( 'token', response.data.accessToken )
						console.log(response)
						this.$router.push({name:'Upload'})
					})
					.catch(error => {
						console.log(error)
						this.errorRes = error.message
						this.errorText = 'Username already taken'
						this.dialog = true
					})
				}
			}
		}
	},
	data: () => ({
		dialog: false,
		valid: true,
		tab: 0,
		tabs: [
			{name:"Login", icon:"mdi-account"},
			{name:"Register", icon:"mdi-account-plus-outline"}
		],
		loggingIn: true,
		errorText: "",
		errorRes: "",
		firstName: "",
		lastName: "",
		email: "",
		username: "",
		password: "",
		verify: "",
		loginUsername: "",
		loginPassword: "",
		show1: false,
		rules: {
			required: value => !!value || "Required."
		}
	})
}
</script>