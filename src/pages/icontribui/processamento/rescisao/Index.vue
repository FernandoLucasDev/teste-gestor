<script setup>
</script>
<template>
	<div class="grid">
		<div class="col-12">
      <h5 >Processamento Rescisão</h5>
    </div>
  </div>
    <TabView>
      <TabPanel header="Ocorrencias relacionadas">
        <div class="card">        
          <div  class="col-12" >
            <Card style="background-color: #DCDCDC;">
                <template #content>
                  <div class="formgrid grid">
                    <div class="field col- 6">
                      <div class="p-float-label">
                        <Dropdown v-model="selectFuncionario" icon="pi pi-user" inputId="dd-funcionario" :options="funcionarios" optionLabel="name" placeholder="Selecione funcionario" class="w-full md:w-14rem"  />
                          <label for="dd-funcionario" >Selecione funcionário</label>
                      </div>  
                    </div>
                    <div class="field col-6">
                      <span class="p-float-label">
                        <Calendar v-model="date" inputId="birth_date" showIcon/>
                        <label for="birth_date">Data</label>
                      </span>
                  </div>  
                  </div>
                </template>
                <template #footer>
                  <div class="formgrid grid">
                    <div class="col-2"></div>
                    <div class="col-3">
                      <Button type="submit" label="Nova Recisão" />
                    </div>
                    <div class="col-2"></div>
                    <div class="col-3">
                      <Button type="button" label="Agendar Recisão"  outlined style="background-color: #DCDCDC; color: black ;" />
                    </div>
                  </div>
                </template>
            </Card> 
          </div>
        </div>      
      </TabPanel>
      <TabPanel header="Consultas- Recisões">
        <div class="card">  
            <Card style="background-color: #DCDCDC;">
                <template #content>
                  <div class="formgrid grid">
                    <div class="field col-6">
                      <span class="p-float-label">
                        <Calendar v-model="date" inputId="birth_date" showIcon />
                        <label for="birth_date">Início</label>
                      </span>
                    </div>
                    <div class="field col-6">
                      <span class="p-float-label">
                        <Calendar v-model="date" inputId="birth_date" showIcon />
                        <label for="birth_date">Término</label>
                      </span>
                    </div>
                  </div>
                  <div class="formgrid grid">
                    <div class="field col- 12">
                      <span class="p-float-label">
                          <InputText id="username" v-model="value" />
                          <label for="username">Cidade</label>
                      </span>
                    </div>
                  </div>
                  <div class="formgrid grid">
                    <div class="field col- 12">
                      <div class="p-float-label">
                        <Dropdown v-model="selectFuncionario" inputId="dd-funcionario" :options="funcionarios" optionLabel="name" placeholder="Selecione funcionario" class="w-full md:w-14rem" />
                          <label for="dd-funcionario">Selecione funcionário</label>
                      </div>  
                    </div>
                  </div>
                  <div class="formgrid grid">
                    <div class="field col- 12">
                      <div class="p-float-label">
                        <Dropdown v-model="selectFuncionario" inputId="dd-funcionario" :options="funcionarios" optionLabel="name" placeholder="Selecione funcionario" class="w-full md:w-14rem" />
                          <label for="dd-funcionario">Agrupar por</label>
                      </div>  
                    </div>  
                  </div>  
                </template>
                <template #footer>
                  <div class="formgrid grid">
                      <div class=" field col-12">
                        <Button type="submit" label="Consultar" />
                      </div>
                  </div>  
                </template>
            </Card> 
        </div>        
      </TabPanel>
  </TabView>
</template>