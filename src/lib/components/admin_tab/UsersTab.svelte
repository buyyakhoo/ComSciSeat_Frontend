<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { enhance } from "$app/forms";
    import Table from "../table/Table.svelte";
    let { users } = $props()
</script>

<div class="mb-6">
    <h1 class="text-2xl font-bold">จัดการผู้ใช้</h1>
    <p class="text-base-content/50 text-sm mt-1">นักศึกษาและอาจารย์ทั้งหมด</p>
</div>
<div class="card bg-base-100 border border-base-300">
    <div class="card-body p-4">
        <input type="text" placeholder="ค้นหา..." class="input input-sm input-bordered mb-4 w-full max-w-xs">
        <div class="overflow-x-auto">
            {#snippet usersHeader()}
                <th>รหัส</th>
                <th>ชื่อ</th>
                <th>อีเมล</th>
                <th>Role</th>
                <th>จองทั้งหมด</th>
                <th>จัดการ</th>
            {/snippet}

            {#snippet usersRow(u: any)}
                <td class="font-mono text-xs">{u.user_id}</td>
                <td>{u.name}</td>
                <td class="text-xs">{u.email}</td>
                <td>
                    <span class="badge badge-sm {u.user_type === 'admin' ? 'badge-secondary' : 'badge-primary'}">
                        {u.user_type}
                    </span>
                </td>
                <td class="font-mono text-xs text-center">{u._count.bookings || '—'}</td>
                <td>
                    <form 
                        method="POST" 
                        action="?/changeUserType" 
                        use:enhance={() => {
                            return async ({ update }) => {
                                await update()
                                invalidateAll()
                            }
                        }}
                    >
                        <input type="hidden" name="userId" value={u.user_id} />
                        <select name="userType" class="select select-xs select-bordered w-24">
                            <option value="student" selected={u.user_type === 'student'}>student</option>
                            <option value="admin" selected={u.user_type === 'admin'}>admin</option>
                        </select>
                        <button class="btn btn-xs btn-outline">แก้ไข Role</button>
                    </form>
                </td>
            {/snippet}

            <Table data={users} header={usersHeader} row={usersRow} />
        </div>
    </div>
</div>